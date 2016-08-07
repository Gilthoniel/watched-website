package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created by gaylor on 8/6/2016.
 *
 */
@Entity
public class MovieBookmark {

    @JsonIgnore
    @ManyToOne
    private Account account;

    @Id
    @GeneratedValue
    private Long id;

    private Integer movieId;
    private Boolean watched;

    MovieBookmark() {}

    public MovieBookmark(Account account, int movieId) {
        this.account = account;
        this.movieId = movieId;
        this.watched = false;
    }

    public Long getId() {
        return id;
    }

    public Account getAccount() {
        return account;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public Boolean isWatched() {
        return watched;
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return obj.getClass() == MovieBookmark.class && ((MovieBookmark) obj).getId().equals(id);
    }
}
