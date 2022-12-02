package ch.luoar.selbstregistrierung.repository;

import ch.luoar.selbstregistrierung.domain.Stammdaten;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Stammdaten entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StammdatenRepository extends JpaRepository<Stammdaten, Long> {}
