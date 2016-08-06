package ch.grim.controllers;

import ch.grim.models.Account;
import ch.grim.models.MovieBookmark;
import ch.grim.models.User;
import ch.grim.models.json.MovieJson;
import ch.grim.repositories.AccountRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.services.MovieDBService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Gaylor on 31.07.2016.
 */
@RequestMapping("${spring.data.rest.base-path}/users")
@RestController
public class SessionController {

    private static final Logger LOG = LoggerFactory.getLogger(SessionController.class);

    private MovieDBService service;

    private AccountRepository accountsJpa;

    private MovieBookmarkRepository bookmarksJpa;

    @Autowired
    public SessionController(AccountRepository accounts, MovieBookmarkRepository bookmarks) {
        this.accountsJpa = accounts;
        this.bookmarksJpa = bookmarks;
    }


    @RequestMapping("/me")
    public User me(@AuthenticationPrincipal User user) {

        Account account = accountsJpa.findOne(user.getId());
        return new User(account);
    }

    @RequestMapping(value = "/me/movies")
    public List<MovieJson> getMovies(@AuthenticationPrincipal User user) {

        return user.getBookmarks()
                .stream()
                .map(bm -> new MovieJson(service.getMovie(bm.getMovieId(), "en")))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/me/movies/{id}", method = RequestMethod.POST)
    public ResponseEntity<String> addMovie(@AuthenticationPrincipal User user, @PathVariable int id) throws Exception {

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        if (account.getBookmarks().stream().filter(bm -> bm.getMovieId().equals(id)).count() == 0) {
            bookmarksJpa.save(new MovieBookmark(account, id));
        }

        return new ResponseEntity<>("Ok", HttpStatus.CREATED);
    }

    @RequestMapping(value = "/me/movies/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> removeMovie(@AuthenticationPrincipal User user, @PathVariable int id) throws Exception {

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        Collection<MovieBookmark> bookmarks = account.getBookmarks().stream()
                .filter(bm -> bm.getMovieId().equals(id))
                .collect(Collectors.toList());

        account.getBookmarks().removeAll(bookmarks);

        LOG.info(bookmarks.size() + " bookmarks found for user " + user.getUsername());
        bookmarksJpa.delete(bookmarks);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
