package ch.grim.websockets;

import ch.grim.models.User;
import ch.grim.services.BookmarkService;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Created by Gaylor on 10.01.2017.
 *
 */
public class WebSocketBookmarksHandler extends TextWebSocketHandler {

    private DefaultTokenServices tokenServices;
    private BookmarkService bmService;

    public WebSocketBookmarksHandler(DefaultTokenServices services, BookmarkService bm) {
        tokenServices = services;
        bmService = bm;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {

        // Define user
        OAuth2Authentication auth = tokenServices.loadAuthentication(message.getPayload());

        if (auth != null) {
            User user = (User) auth.getPrincipal();
            bmService.loadBookmarks(session, user, "en");
        }
    }

}
