package ch.luoar.selbstregistrierung.repository;

import ch.luoar.selbstregistrierung.domain.ZDP;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ZDP entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ZDPRepository extends JpaRepository<ZDP, Long> {}
