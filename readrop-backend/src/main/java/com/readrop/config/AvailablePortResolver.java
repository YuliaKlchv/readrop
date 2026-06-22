package com.readrop.config;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;

public class AvailablePortResolver {

    private static final int MAX_PORT = 65535;
    private static final int MAX_ATTEMPTS = 100;

    private final PortAvailabilityChecker portAvailabilityChecker;

    public AvailablePortResolver() {
        this(new SocketPortAvailabilityChecker());
    }

    AvailablePortResolver(PortAvailabilityChecker portAvailabilityChecker) {
        this.portAvailabilityChecker = portAvailabilityChecker;
    }

    public int resolve(int requestedPort) {
        validatePort(requestedPort);

        int lastPort = Math.min(MAX_PORT, requestedPort + MAX_ATTEMPTS);
        for (int port = requestedPort; port <= lastPort; port++) {
            if (portAvailabilityChecker.isAvailable(port)) {
                return port;
            }
        }

        throw new IllegalStateException("No available port found between "
                + requestedPort + " and " + lastPort + ".");
    }

    private void validatePort(int port) {
        if (port < 1 || port > MAX_PORT) {
            throw new IllegalArgumentException("Port must be between 1 and " + MAX_PORT + ".");
        }
    }

    interface PortAvailabilityChecker {

        boolean isAvailable(int port);
    }

    private static class SocketPortAvailabilityChecker implements PortAvailabilityChecker {

        @Override
        public boolean isAvailable(int port) {
            try (ServerSocket socket = new ServerSocket()) {
                socket.setReuseAddress(false);
                socket.bind(new InetSocketAddress(port));
                return true;
            } catch (IOException ex) {
                return false;
            }
        }
    }
}
