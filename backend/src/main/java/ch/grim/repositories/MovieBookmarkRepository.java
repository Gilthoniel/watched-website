package ch.grim.repositories;

import ch.grim.models.MovieBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

/**
 * Created by gaylo on 8/6/2016.
 *
 */
public interface MovieBookmarkRepository extends JpaRepository<MovieBookmark, Long> {
    Collection<MovieBookmark> findByAccountUsername(String username);

    Optional<MovieBookmark> findByAccountUsernameAndMovieId(String username, Integer movieId);
}
