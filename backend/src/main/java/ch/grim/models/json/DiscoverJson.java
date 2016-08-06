package ch.grim.models.json;

import com.fasterxml.jackson.annotation.JsonInclude;
import info.movito.themoviedbapi.model.core.MovieResultsPage;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by gaylor on 8/5/2016.
 *
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiscoverJson {
    private List<MovieJson> movies;
    private int page;
    private int totalPage;

    public DiscoverJson(MovieResultsPage results) {
        movies = new LinkedList<>();
        page = results.getPage();
        totalPage = results.getTotalPages();

        // populate the array
        results.forEach(movieDb -> movies.add(new MovieJson(movieDb)));
    }

    public List<MovieJson> getMovies() {
        return movies;
    }

    public int getPage() {
        return page;
    }

    public int getTotalPage() {
        return totalPage;
    }
}
