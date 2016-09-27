package ch.grim.models;

import info.movito.themoviedbapi.TvResultsPage;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by Gaylor on 10.08.2016.
 *
 */
public class SeriesSearchResults {

    private int page;
    private int totalPage;
    private List<Series> results;

    public SeriesSearchResults(TvResultsPage results, User user) {
        page = results.getPage();
        totalPage = results.getTotalPages();

        this.results = new LinkedList<>();
        results.forEach(tvSeries -> {
            this.results.add(new Series(tvSeries));
        });
    }

    public int getPage() {
        return page;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public List<Series> getResults() {
        return results;
    }
}
