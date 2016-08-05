package ch.grim.models;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Gaylor on 31.07.2016.
 *
 */
@Entity
public class UserPreference {

    @Id
    @Column(unique = true)
    private String id;

    @ElementCollection
    private List<Integer> movies;

    private UserPreference() {}

    public UserPreference(User user) {
        id = user.getId();
        movies = new ArrayList<>();
    }

    public List<Integer> getMovies() {
        return movies;
    }

    public String getId() {
        return id;
    }
}
