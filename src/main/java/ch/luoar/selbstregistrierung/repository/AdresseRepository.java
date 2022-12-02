package ch.luoar.selbstregistrierung.repository;

import ch.luoar.selbstregistrierung.domain.Adresse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Adresse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdresseRepository extends JpaRepository<Adresse, Long> {}
