package com.skilloport.service;

import com.skilloport.error.ApiException;
import com.skilloport.model.Lead;
import com.skilloport.repository.LeadRepository;
import com.skilloport.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/** Marketing-lead capture and the combined subscribers view. */
@Service
public class SubscriberService {

    private final UserRepository users;
    private final LeadRepository leads;

    public SubscriberService(UserRepository users, LeadRepository leads) {
        this.users = users;
        this.leads = leads;
    }

    @Transactional
    public void subscribe(String rawEmail) {
        if (!Validation.emailOk(rawEmail)) {
            throw ApiException.badRequest("Please enter a valid email address.");
        }
        String email = rawEmail.trim().toLowerCase(Locale.ROOT);

        // Already a real user, or already a lead -> nothing to do.
        if (users.existsByEmail(email) || leads.existsByEmail(email)) {
            return;
        }
        leads.save(new Lead(email));
    }

    @Transactional(readOnly = true)
    public List<SubscriberView> listSubscribers() {
        List<SubscriberView> rows = new ArrayList<>();

        Set<String> userEmails = users.findAll().stream()
                .map(u -> u.getEmail().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        users.findAll().forEach(u ->
                rows.add(SubscriberView.user(u.getEmail(), u.getPlan(), u.getCreatedAt())));

        leads.findByConvertedAtIsNull().stream()
                .filter(l -> !userEmails.contains(l.getEmail().toLowerCase(Locale.ROOT)))
                .forEach(l -> rows.add(SubscriberView.lead(l.getEmail(), l.getCreatedAt())));

        // Newest first, then email descending (stable, matches the old SQL ordering).
        rows.sort(Comparator
                .comparing(SubscriberView::createdAt, Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(SubscriberView::email)
                .reversed());

        return rows;
    }
}
