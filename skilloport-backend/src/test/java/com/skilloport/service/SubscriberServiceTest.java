package com.skilloport.service;

import com.skilloport.error.ApiException;
import com.skilloport.model.Lead;
import com.skilloport.repository.LeadRepository;
import com.skilloport.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriberServiceTest {

    @Mock
    private UserRepository users;
    @Mock
    private LeadRepository leads;

    @InjectMocks
    private SubscriberService subscriberService;

    @Test
    void subscribe_saves_new_lead() {
        when(users.existsByEmail("new@example.com")).thenReturn(false);
        when(leads.existsByEmail("new@example.com")).thenReturn(false);

        subscriberService.subscribe("New@Example.com");

        verify(leads).save(any(Lead.class));
    }

    @Test
    void subscribe_skips_when_user_already_exists() {
        when(users.existsByEmail("known@example.com")).thenReturn(true);

        subscriberService.subscribe("known@example.com");

        verify(leads, never()).save(any());
    }

    @Test
    void subscribe_skips_duplicate_lead() {
        when(users.existsByEmail("dup@example.com")).thenReturn(false);
        when(leads.existsByEmail("dup@example.com")).thenReturn(true);

        subscriberService.subscribe("dup@example.com");

        verify(leads, never()).save(any());
    }

    @Test
    void subscribe_rejects_invalid_email() {
        assertThatThrownBy(() -> subscriberService.subscribe("not-an-email"))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("valid email");
        verify(leads, never()).save(any());
        verify(users, never()).existsByEmail(anyString());
    }
}
