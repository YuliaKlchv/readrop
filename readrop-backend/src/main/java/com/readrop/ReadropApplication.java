package com.readrop;

import com.readrop.config.AutoPortApplicationListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReadropApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(ReadropApplication.class);
        application.addListeners(new AutoPortApplicationListener());
        application.run(args);
    }
}
