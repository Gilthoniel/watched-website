package ch.grim.repositories;

import ch.grim.models.MovieBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

/**
 * Created by gaylo on 8/6/2016.
 *
 */
public interface MovieBookmarkRepository extends JpaRepository<MovieBookmark, Long> {
    Collection<MovieBookmark> findByAccountId(long id);

    Optional<MovieBookmark> findByAccountIdAndMovieId(long id, Integer movieId);

    @Modifying
    @Transactional
    @Query("update MovieBookmark bm set bm.watched = ?3 where bm.account.id = ?1 and bm.movieId = ?2")
    void setWatchedByAccountIdAndMovieId(long userId, int movieId, boolean watched);
}
