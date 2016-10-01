package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

/**
 * Created by Gaylor on 8/6/2016.
 *
 */
@Entity
public class Account implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<MovieBookmark> bookmarks = new HashSet<>();

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<SeriesBookmark> seriesBookmarks = new HashSet<>();

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<EpisodeBookmark> episodeBookmarks = new HashSet<>();

    private String username;
    private String email;

    @JsonIgnore
    private String password;
    @JsonIgnore
    private String registerId;

    Account() {}

    public Account(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Account(String username, String email, String password, String registerId) {
        this(username, email, password);
        this.registerId = registerId;
    }

    public boolean confirm(String uuid) {
        return uuid == null || uuid.equals(registerId);
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRegisterId() {
        return registerId;
    }

    public boolean isEnabled() {
        return registerId == null;
    }

    public Set<MovieBookmark> getBookmarks() {
        return bookmarks;
    }

    public Set<SeriesBookmark> getSeriesBookmarks() {
        return seriesBookmarks;
    }

    public Set<EpisodeBookmark> getEpisodeBookmarks() {
        return episodeBookmarks;
    }

    public String getEmail() {
        return email;
    }
}
