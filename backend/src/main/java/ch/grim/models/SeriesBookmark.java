package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created by Gaylor on 27.09.2016.
 *
 */
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SeriesBookmark {

    @JsonIgnore
    @ManyToOne
    private Account account;

    @Id
    @GeneratedValue
    private Long id;

    private int seriesId;

    SeriesBookmark() {}

    public Long getId() {
        return id;
    }

    public int getSeriesId() {
        return seriesId;
    }
}
