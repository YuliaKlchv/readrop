package com.skilloport.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.nio.file.Path;

/**
 * Serves the built SPA from the dist/ directory and forwards client-side routes
 * to index.html.
 * Only relevant in production (in dev, Vite serves the frontend).
 */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    private final Path distDir;

    public SpaWebConfig(@Value("${app.dist-dir}") String distDir) {
        this.distDir = Path.of(distDir);
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations(distDir.toUri().toString())
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location) {
                        // Never hijack API calls.
                        if (resourcePath.startsWith("api/")) {
                            return null;
                        }
                        try {
                            Resource requested = location.createRelative(resourcePath);
                            if (requested.exists() && requested.isReadable()) {
                                return requested;
                            }
                        } catch (java.io.IOException ignored) {
                            // fall through to the SPA index
                        }
                        // SPA fallback
                        Resource index = new FileSystemResource(distDir.resolve("index.html"));
                        return index.exists() ? index : null;
                    }
                });
    }
}
