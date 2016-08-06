package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

/**
 * Created by gaylo on 8/6/2016.
 *
 */
@Entity
public class Account implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<MovieBookmark> bookmarks = new HashSet<>();

    private String username;
    private String email;

    @JsonIgnore
    private String password;

    Account() {}

    public Account(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
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

    public Set<MovieBookmark> getBookmarks() {
        return bookmarks;
    }

    public String getEmail() {
        return email;
    }
}
