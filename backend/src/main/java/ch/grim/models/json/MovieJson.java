package ch.grim.models.json;

import com.fasterxml.jackson.annotation.JsonInclude;
import info.movito.themoviedbapi.model.MovieDb;

import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * Created by gaylo on 8/5/2016.
 *
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MovieJson {

    private static SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    private int id;
    private String title;
    private String overview;
    private String poster;
    private Long releaseDate;

    public MovieJson(MovieDb movie) {
        id = movie.getId();
        title = movie.getTitle();
        overview = movie.getOverview();
        poster = movie.getPosterPath();
        try {
            releaseDate = formatter.parse(movie.getReleaseDate()).getTime();
        } catch (ParseException ignored) {}
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getOverview() {
        return overview;
    }

    public String getPoster() {
        return poster;
    }

    public Long getReleaseDate() {
        return releaseDate;
    }
}
