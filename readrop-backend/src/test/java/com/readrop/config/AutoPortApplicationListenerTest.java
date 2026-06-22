package com.readrop.config;

import com.readrop.ReadropApplication;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultBootstrapContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import static org.assertj.core.api.Assertions.assertThat;

class AutoPortApplicationListenerTest {

    @Test
    void onApplicationEvent_overrides_server_port_with_first_available_port() {
        AvailablePortResolver resolver = new AvailablePortResolver(port -> port != 3000);
        StandardEnvironment environment = environmentWithProperties(Map.of("server.port", "3000"));

        new AutoPortApplicationListener(resolver).onApplicationEvent(event(environment));

        assertThat(environment.getProperty("server.port"))
                .isEqualTo("3001");
    }

    @Test
    void onApplicationEvent_keeps_requested_port_when_auto_increment_is_disabled() {
        AvailablePortResolver resolver = new AvailablePortResolver(port -> port != 3000);
        StandardEnvironment environment = environmentWithProperties(Map.of(
                "server.port", "3000",
                "app.port.auto-increment", "false"));

        new AutoPortApplicationListener(resolver).onApplicationEvent(event(environment));

        assertThat(environment.getProperty("server.port"))
                .isEqualTo("3000");
    }

    private StandardEnvironment environmentWithProperties(Map<String, Object> properties) {
        StandardEnvironment environment = new StandardEnvironment();
        environment.getPropertySources().addFirst(new MapPropertySource("testProperties", properties));
        return environment;
    }

    private ApplicationEnvironmentPreparedEvent event(StandardEnvironment environment) {
        return new ApplicationEnvironmentPreparedEvent(
                new DefaultBootstrapContext(),
                new SpringApplication(ReadropApplication.class),
                new String[0],
                environment);
    }
}
