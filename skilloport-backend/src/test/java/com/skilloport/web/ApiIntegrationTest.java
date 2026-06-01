package com.skilloport.web;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** End-to-end HTTP tests over the real stack (H2 + Flyway + Spring Security). */
@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

    private static final String DEMO_EMAIL = "demo@skilloport.app";
    private static final String DEMO_PASSWORD = "SkillOportDemo123!";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void health_is_public() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    void me_requires_authentication() throws Exception {
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Not authenticated"));
    }

    @Test
    void login_with_wrong_password_is_unauthorized() throws Exception {
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + DEMO_EMAIL + "\",\"password\":\"nope\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }

    @Test
    void login_then_me_returns_demo_user() throws Exception {
        MvcResult login = mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + DEMO_EMAIL + "\",\"password\":\"" + DEMO_PASSWORD + "\"}"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("sid"))
                .andExpect(jsonPath("$.user.email").value(DEMO_EMAIL))
                .andExpect(jsonPath("$.user.plan").value("pro"))
                .andReturn();

        Cookie sid = login.getResponse().getCookie("sid");
        assertThat(sid).isNotNull();

        mockMvc.perform(get("/api/me").cookie(sid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value(DEMO_EMAIL));
    }

    @Test
    void signup_with_short_password_is_bad_request() throws Exception {
        mockMvc.perform(post("/api/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"X\",\"email\":\"x@example.com\",\"password\":\"short\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Password must be at least 12 characters."));
    }

    @Test
    void subscribe_accepts_valid_email() throws Exception {
        mockMvc.perform(post("/api/subscribe")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"newsletter@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true));
    }

    @Test
    void subscribers_requires_authentication() throws Exception {
        mockMvc.perform(get("/api/subscribers"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void unknown_api_route_is_not_found() throws Exception {
        mockMvc.perform(get("/api/does-not-exist"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not found"));
    }
}
