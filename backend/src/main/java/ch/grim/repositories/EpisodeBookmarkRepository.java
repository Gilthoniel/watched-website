package ch.grim.repositories;

import ch.grim.models.EpisodeBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Created by Gaylor on 28.09.2016.
 * Database for the bookmarks of the episodes
 */
public interface EpisodeBookmarkRepository extends JpaRepository<EpisodeBookmark, Long> {

    Optional<EpisodeBookmark> findByAccountIdAndSerieIdAndEpisodeId(Long id, int serieId, int episodeId);

}
