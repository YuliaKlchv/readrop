package com.readrop.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** End-to-end HTTP tests over the real stack (H2 + Flyway + Spring Security). */
@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

    private static final String DEMO_EMAIL = "demo@readrop.app";
    private static final String DEMO_PASSWORD = "ReadropDemo123!";

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

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
        Cookie sid = loginAsDemo();
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
    void subscribers_requires_authentication() throws Exception {
        mockMvc.perform(get("/api/subscribers"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void books_endpoint_is_public() throws Exception {
        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.books").isArray());
    }

    @Test
    void create_book_requires_authentication() throws Exception {
        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Dune\",\"author\":\"Frank Herbert\","
                                + "\"genre\":\"Sci-Fi\",\"condition\":\"GOOD\","
                                + "\"city\":\"Berlin\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void unknown_api_route_is_not_found() throws Exception {
        mockMvc.perform(get("/api/does-not-exist"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not found"));
    }

    @Test
    void login_sets_http_only_cookie_with_expected_attributes() throws Exception {
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + DEMO_EMAIL
                                + "\",\"password\":\"" + DEMO_PASSWORD + "\"}"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("sid"))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("HttpOnly")))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("SameSite=Lax")))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("Path=/")));
    }

    @Test
    void me_with_invalid_cookie_is_unauthorized() throws Exception {
        mockMvc.perform(get("/api/me").cookie(new Cookie("sid", "invalid-token")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Not authenticated"));
    }

    @Test
    void signup_with_duplicate_email_is_conflict() throws Exception {
        mockMvc.perform(post("/api/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Demo Copy\",\"email\":\"" + DEMO_EMAIL
                                + "\",\"password\":\"GoodPass123!\",\"city\":\"Berlin\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error")
                        .value("An account with this email already exists."));
    }

    @Test
    void logout_clears_cookie_and_followup_me_is_unauthorized() throws Exception {
        Cookie sid = loginAsDemo();

        MvcResult logout = mockMvc.perform(post("/api/logout").cookie(sid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true))
                .andReturn();

        Cookie cleared = logout.getResponse().getCookie("sid");
        assertThat(cleared).isNotNull();
        assertThat(cleared.getValue()).isEmpty();
        assertThat(cleared.getMaxAge()).isZero();

        mockMvc.perform(get("/api/me").cookie(cleared))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Not authenticated"));
    }

    @Test
    void authenticated_user_can_create_book_and_see_it_in_my_books() throws Exception {
        Cookie sid = loginAsDemo();
        String title = "Portfolio Test Book " + UUID.randomUUID();

        MvcResult created = mockMvc.perform(post("/api/books")
                        .cookie(sid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"" + title + "\",\"author\":\"QA Author\","
                                + "\"genre\":\"Testing\",\"condition\":\"good\","
                                + "\"description\":\"Fresh test listing\","
                                + "\"city\":\"Vienna\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.book.title").value(title))
                .andExpect(jsonPath("$.book.condition").value("GOOD"))
                .andReturn();

        long bookId = objectMapper.readTree(created.getResponse().getContentAsString())
                .at("/book/id")
                .asLong();
        assertThat(bookId).isPositive();

        MvcResult myBooks = mockMvc.perform(get("/api/books/my").cookie(sid))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(myBooks.getResponse().getContentAsString()).contains(title);
    }

    @Test
    void create_book_with_invalid_condition_is_bad_request() throws Exception {
        Cookie sid = loginAsDemo();

        mockMvc.perform(post("/api/books")
                        .cookie(sid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Bad Condition\",\"author\":\"QA Author\","
                                + "\"genre\":\"Testing\",\"condition\":\"MINT\","
                                + "\"city\":\"Vienna\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Condition must be GREAT, GOOD, or WORN."));
    }

    @Test
    void my_books_returns_only_authenticated_users_own_books() throws Exception {
        String suffix = UUID.randomUUID().toString();
        Cookie userOne = signup("User One", "user.one+" + suffix + "@example.com", "GoodPass123!");
        Cookie userTwo = signup("User Two", "user.two+" + suffix + "@example.com", "GoodPass123!");
        String userOneTitle = "User One Book " + suffix;
        String userTwoTitle = "User Two Book " + suffix;

        mockMvc.perform(post("/api/books")
                        .cookie(userOne)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"" + userOneTitle + "\",\"author\":\"Author One\","
                                + "\"genre\":\"Testing\",\"condition\":\"GOOD\","
                                + "\"city\":\"Vienna\"}"))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/books")
                        .cookie(userTwo)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"" + userTwoTitle + "\",\"author\":\"Author Two\","
                                + "\"genre\":\"Testing\",\"condition\":\"GOOD\","
                                + "\"city\":\"Berlin\"}"))
                .andExpect(status().isCreated());

        MvcResult userOneBooks = mockMvc.perform(get("/api/books/my").cookie(userOne))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(userOneBooks.getResponse().getContentAsString()).contains(userOneTitle);
        assertThat(userOneBooks.getResponse().getContentAsString()).doesNotContain(userTwoTitle);
    }

    @Test
    void claim_endpoint_requires_authentication() throws Exception {
        mockMvc.perform(post("/api/books/999999/claim")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Interested\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Not authenticated"));
    }

    @Test
    void user_cannot_claim_own_book() throws Exception {
        Cookie sid = loginAsDemo();
        long bookId = createBookAndReturnId(sid, "Self Claim " + UUID.randomUUID(), "Vienna");

        mockMvc.perform(post("/api/books/" + bookId + "/claim")
                        .cookie(sid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Trying to claim my own book\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("You cannot claim your own book."));
    }

    @Test
    void already_claimed_book_returns_conflict() throws Exception {
        String suffix = UUID.randomUUID().toString();
        Cookie owner = signup("Owner", "owner+" + suffix + "@example.com", "GoodPass123!");
        Cookie claimerOne = signup("Claimer One", "claimer.one+" + suffix + "@example.com",
                "GoodPass123!");
        Cookie claimerTwo = signup("Claimer Two", "claimer.two+" + suffix + "@example.com",
                "GoodPass123!");
        long bookId = createBookAndReturnId(owner, "Claim Once " + suffix, "Graz");

        mockMvc.perform(post("/api/books/" + bookId + "/claim")
                        .cookie(claimerOne)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"First claim\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.claim.status").value("PENDING"));

        mockMvc.perform(post("/api/books/" + bookId + "/claim")
                        .cookie(claimerTwo)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Second claim\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("This book is no longer available."));
    }

    @Test
    void subscribers_endpoint_is_currently_accessible_to_any_authenticated_user() throws Exception {
        Cookie sid = loginAsDemo();

        mockMvc.perform(get("/api/subscribers").cookie(sid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").isNumber())
                .andExpect(jsonPath("$.subscribers").isArray())
                .andExpect(jsonPath("$.subscribers[0].email").exists());
    }

    private Cookie loginAsDemo() throws Exception {
        MvcResult login = mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + DEMO_EMAIL
                                + "\",\"password\":\"" + DEMO_PASSWORD + "\"}"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("sid"))
                .andExpect(jsonPath("$.user.email").value(DEMO_EMAIL))
                .andReturn();
        return login.getResponse().getCookie("sid");
    }

    private Cookie signup(String name, String email, String password) throws Exception {
        MvcResult signup = mockMvc.perform(post("/api/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + name + "\",\"email\":\"" + email
                                + "\",\"password\":\"" + password + "\",\"city\":\"Vienna\"}"))
                .andExpect(status().isCreated())
                .andExpect(cookie().exists("sid"))
                .andReturn();
        return signup.getResponse().getCookie("sid");
    }

    private long createBookAndReturnId(Cookie sid, String title, String city) throws Exception {
        MvcResult created = mockMvc.perform(post("/api/books")
                        .cookie(sid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"" + title + "\",\"author\":\"QA Author\","
                                + "\"genre\":\"Testing\",\"condition\":\"GOOD\","
                                + "\"city\":\"" + city + "\"}"))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(created.getResponse().getContentAsString())
                .at("/book/id")
                .asLong();
    }
}
