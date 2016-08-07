package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import info.movito.themoviedbapi.model.core.MovieResultsPage;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

/**
 * Created by Gaylor on 8/7/2016.
 * Populate the MovieResultsPage with the according bookmark if it exists
 */
public class DiscoverResultPage {

    private int page;
    @JsonProperty(value = "total_page")
    private int totalPage;
    private List<Movie> results;

    public DiscoverResultPage(MovieResultsPage movies, Collection<MovieBookmark> bookmarks) {
        page = movies.getPage();
        totalPage = movies.getTotalPages();

        results = new LinkedList<>();
        movies.getResults().forEach(movie -> {
            Optional<MovieBookmark> bookmark = bookmarks
                    .stream()
                    .filter(bm -> bm.getMovieId() == movie.getId())
                    .findFirst();

            if (bookmark.isPresent()) {
                results.add(new Movie(movie, bookmark.get()));
            } else {
                results.add(new Movie(movie));
            }
        });
    }

    public int getPage() {
        return page;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public List<Movie> getResults() {
        return results;
    }
}
