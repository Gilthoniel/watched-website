package ch.grim.controllers;

import ch.grim.models.User;
import ch.grim.models.UserPreference;
import ch.grim.repositories.UserPreferenceRepository;
import com.stormpath.sdk.servlet.account.AccountResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletRequest;

/**
 * Created by Gaylor on 31.07.2016.
 *
 */
@RequestMapping("${spring.data.rest.base-path}/users")
@RestController
public class SessionController {

    private UserPreferenceRepository repository;

    @Autowired
    public SessionController(UserPreferenceRepository repository) {
        this.repository = repository;
    }

    @RequestMapping("/me")
    public User me(ServletRequest request) {

        if (AccountResolver.INSTANCE.hasAccount(request)) {
            return new User(AccountResolver.INSTANCE.getRequiredAccount(request));
        } else {
            throw new ResourceNotFoundException("Cannot find the user");
        }
    }

    @RequestMapping("/me/preference")
    public UserPreference preference(ServletRequest request) {
        if (AccountResolver.INSTANCE.hasAccount(request)) {
            User user = new User(AccountResolver.INSTANCE.getRequiredAccount(request));
            UserPreference preference = repository.findOne(user.getId());

            if (preference == null) {
                preference = new UserPreference(user);
                repository.save(preference);
            }

            return preference;
        } else {
            throw new ResourceNotFoundException("Cannot find the user");
        }
    }

    @RequestMapping(value = "/me/movie/{id}", method = RequestMethod.GET)
    public ResponseEntity<String> addMovie(ServletRequest request, @PathVariable int id) {

        if (AccountResolver.INSTANCE.hasAccount(request)) {
            User user = new User(AccountResolver.INSTANCE.getRequiredAccount(request));
            UserPreference preference = repository.findOne(user.getId());

            if (preference == null) {
                preference = new UserPreference(user);
                repository.save(preference);
            }

            if (!preference.getMovies().contains(id)) {
                preference.getMovies().add(id);
                repository.save(preference);
            }

            return new ResponseEntity<>("Ok", HttpStatus.CREATED);
        }

        throw new ResourceNotFoundException();
    }
}
