package ch.grim.repositories;

import ch.grim.models.SeriesBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

/**
 * Created by Gaylor on 27.09.2016.
 * Repository for the series bookmarks of the users
 */
public interface SeriesBookmarkRepository extends JpaRepository<SeriesBookmark, Long> {

    Collection<SeriesBookmark> findByAccountId(long id);

    Optional<SeriesBookmark> findByAccountIdAndSeriesId(long id, int seriesId);

}
