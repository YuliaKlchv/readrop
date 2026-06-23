package com.readrop.service;

import com.readrop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/** Subscriber list for authenticated frontend views. No role filter is enforced yet. */
@Service
public class SubscriberService {

    private final UserRepository users;

    public SubscriberService(UserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<SubscriberView> listSubscribers() {
        return users.findAll().stream()
                .map(u -> SubscriberView.user(u.getEmail(), u.getPlan(), u.getCreatedAt()))
                .sorted(Comparator
                        .comparing(SubscriberView::createdAt,
                                Comparator.nullsLast(Comparator.naturalOrder()))
                        .reversed())
                .toList();
    }
}
