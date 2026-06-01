package com.skilloport.web;

import com.skilloport.dto.SubscribeRequest;
import com.skilloport.service.SubscriberService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Public email-only lead capture. */
@RestController
@RequestMapping("/api")
public class SubscribeController {

    private final SubscriberService subscriberService;

    public SubscribeController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @PostMapping("/subscribe")
    public Map<String, Boolean> subscribe(@RequestBody(required = false) SubscribeRequest body) {
        subscriberService.subscribe(body == null ? null : body.email());
        return Map.of("ok", true);
    }
}
