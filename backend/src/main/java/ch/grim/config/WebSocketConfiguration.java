package ch.grim.config;

import ch.grim.services.BookmarkService;
import ch.grim.websockets.WebSocketBookmarksHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * Created by Gaylor on 10.01.2017.
 *
 */
@Controller
@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    private final DefaultTokenServices tokenServices;
    private final BookmarkService bmService;

    @Autowired
    public WebSocketConfiguration(DefaultTokenServices tokenServices, BookmarkService bmService) {
        this.tokenServices = tokenServices;
        this.bmService = bmService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myHandler(), "/websocket/bookmarks")
                .setAllowedOrigins("http://localhost:8080", "https://grimsoft.ch")
                .withSockJS();
    }

    @Bean
    public WebSocketBookmarksHandler myHandler() {
        return new WebSocketBookmarksHandler(tokenServices, bmService);
    }
}
