package com.readrop.config;

import java.util.Map;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class AutoPortApplicationListener implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    private static final String PROPERTY_SOURCE_NAME = "autoPortOverride";
    private static final String SERVER_PORT = "server.port";
    private static final String AUTO_INCREMENT_ENABLED = "app.port.auto-increment";

    private final AvailablePortResolver portResolver;

    public AutoPortApplicationListener() {
        this(new AvailablePortResolver());
    }

    AutoPortApplicationListener(AvailablePortResolver portResolver) {
        this.portResolver = portResolver;
    }

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment environment = event.getEnvironment();
        if (!environment.getProperty(AUTO_INCREMENT_ENABLED, Boolean.class, true)) {
            return;
        }

        int requestedPort = environment.getProperty(SERVER_PORT, Integer.class, 3000);
        if (requestedPort == 0) {
            return;
        }

        int resolvedPort = portResolver.resolve(requestedPort);
        environment.getPropertySources().addFirst(new MapPropertySource(
                PROPERTY_SOURCE_NAME,
                Map.of(SERVER_PORT, String.valueOf(resolvedPort))));

        if (resolvedPort != requestedPort) {
            System.out.printf(
                    "Port %d is already in use. Starting Readrop on available port %d.%n",
                    requestedPort,
                    resolvedPort);
        }
    }
}
