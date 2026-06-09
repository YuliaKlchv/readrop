package com.readrop.web;

import com.readrop.service.SubscriberService;
import com.readrop.service.SubscriberView;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** Admin view: registered users. Requires an authenticated session. */
@RestController
@RequestMapping("/api")
public class SubscribersController {

    private final SubscriberService subscriberService;

    public SubscribersController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @GetMapping("/subscribers")
    public Map<String, Object> subscribers() {
        List<SubscriberView> rows = subscriberService.listSubscribers();
        return Map.of("count", rows.size(), "subscribers", rows);
    }
}
