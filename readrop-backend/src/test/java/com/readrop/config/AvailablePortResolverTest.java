package com.readrop.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AvailablePortResolverTest {

    @Test
    void resolve_returns_requested_port_when_available() {
        AvailablePortResolver resolver = new AvailablePortResolver(port -> true);

        assertThat(resolver.resolve(3000))
                .isEqualTo(3000);
    }

    @Test
    void resolve_returns_next_port_when_requested_port_is_in_use() {
        AvailablePortResolver resolver = new AvailablePortResolver(port -> port != 3000);

        assertThat(resolver.resolve(3000))
                .isEqualTo(3001);
    }
}
