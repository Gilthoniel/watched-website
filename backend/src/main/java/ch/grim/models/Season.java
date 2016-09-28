package ch.grim.models;

import info.movito.themoviedbapi.model.tv.TvSeason;

import java.util.Collection;
import java.util.stream.Collectors;

/**
 * Created by Gaylor on 28.09.2016.
 * Season of a TV Show
 */
public class Season {

    private int id;

    private Collection<Episode> episodes;

    public Season(TvSeason season) {
        id = season.getId();
        episodes = season.getEpisodes().stream().map(Episode::new).collect(Collectors.toList());
    }

    public int getId() {
        return id;
    }

    public Collection<Episode> getEpisodes() {
        return episodes;
    }
}
