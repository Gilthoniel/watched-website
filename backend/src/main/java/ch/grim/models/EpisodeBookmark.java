package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created by Gaylor on 28.09.2016.
 * Represent a bookmark for an episode of a TV Show
 */
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EpisodeBookmark {

    @JsonIgnore
    @ManyToOne
    private Account account;

    @Id
    @GeneratedValue
    private Long id;

    private int serieId;
    private int episodeId;

    EpisodeBookmark() {}

    public EpisodeBookmark(Account account, int serieId, int episodeId) {
        this.account = account;
        this.serieId = serieId;
        this.episodeId = episodeId;
    }

    public Account getAccount() {
        return account;
    }

    public Long getId() {
        return id;
    }

    public int getSerieId() {
        return serieId;
    }

    public int getEpisodeId() {
        return episodeId;
    }
}
