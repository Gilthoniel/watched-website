package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import info.movito.themoviedbapi.model.tv.TvEpisode;

import javax.persistence.*;

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
    @JsonProperty(value = "season_number")
    private int seasonNumber;
    @JsonProperty(value = "episode_number")
    private int episodeNumber;
    private int episodeId;

    EpisodeBookmark() {}

    public EpisodeBookmark(Account account, Episode episode) {
        this.account = account;
        this.serieId = episode.getSeriesId();
        this.seasonNumber = episode.getSeasonNumber();
        this.episodeNumber = episode.getEpisodeNumber();
        this.episodeId = episode.getId();
    }

    public EpisodeBookmark(Account account, TvEpisode episode, int seriesId) {
        this.account = account;
        this.serieId = seriesId;
        this.seasonNumber = episode.getSeasonNumber();
        this.episodeNumber = episode.getEpisodeNumber();
        this.episodeId = episode.getId();
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

    public int getSeasonNumber() {
        return seasonNumber;
    }

    public int getEpisodeNumber() {
        return episodeNumber;
    }

    public int getEpisodeId() {
        return episodeId;
    }
}
