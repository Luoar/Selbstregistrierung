package ch.luoar.selbstregistrierung.web.rest;

import ch.luoar.selbstregistrierung.domain.ZDP;
import ch.luoar.selbstregistrierung.repository.ZDPRepository;
import ch.luoar.selbstregistrierung.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ch.luoar.selbstregistrierung.domain.ZDP}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ZDPResource {

    private final Logger log = LoggerFactory.getLogger(ZDPResource.class);

    private static final String ENTITY_NAME = "zDP";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ZDPRepository zDPRepository;

    public ZDPResource(ZDPRepository zDPRepository) {
        this.zDPRepository = zDPRepository;
    }

    /**
     * {@code POST  /zdps} : Create a new zDP.
     *
     * @param zDP the zDP to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new zDP, or with status {@code 400 (Bad Request)} if the zDP has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/zdps")
    public ResponseEntity<ZDP> createZDP(@RequestBody ZDP zDP) throws URISyntaxException {
        log.debug("REST request to save ZDP : {}", zDP);
        if (zDP.getId() != null) {
            throw new BadRequestAlertException("A new zDP cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ZDP result = zDPRepository.save(zDP);
        return ResponseEntity
            .created(new URI("/api/zdps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /zdps/:id} : Updates an existing zDP.
     *
     * @param id the id of the zDP to save.
     * @param zDP the zDP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated zDP,
     * or with status {@code 400 (Bad Request)} if the zDP is not valid,
     * or with status {@code 500 (Internal Server Error)} if the zDP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/zdps/{id}")
    public ResponseEntity<ZDP> updateZDP(@PathVariable(value = "id", required = false) final Long id, @RequestBody ZDP zDP)
        throws URISyntaxException {
        log.debug("REST request to update ZDP : {}, {}", id, zDP);
        if (zDP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, zDP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!zDPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ZDP result = zDPRepository.save(zDP);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, zDP.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /zdps/:id} : Partial updates given fields of an existing zDP, field will ignore if it is null
     *
     * @param id the id of the zDP to save.
     * @param zDP the zDP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated zDP,
     * or with status {@code 400 (Bad Request)} if the zDP is not valid,
     * or with status {@code 404 (Not Found)} if the zDP is not found,
     * or with status {@code 500 (Internal Server Error)} if the zDP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/zdps/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ZDP> partialUpdateZDP(@PathVariable(value = "id", required = false) final Long id, @RequestBody ZDP zDP)
        throws URISyntaxException {
        log.debug("REST request to partial update ZDP partially : {}, {}", id, zDP);
        if (zDP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, zDP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!zDPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ZDP> result = zDPRepository
            .findById(zDP.getId())
            .map(existingZDP -> {
                if (zDP.getZdpNummer() != null) {
                    existingZDP.setZdpNummer(zDP.getZdpNummer());
                }

                return existingZDP;
            })
            .map(zDPRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, zDP.getId().toString())
        );
    }

    /**
     * {@code GET  /zdps} : get all the zDPS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of zDPS in body.
     */
    @GetMapping("/zdps")
    public List<ZDP> getAllZDPS() {
        log.debug("REST request to get all ZDPS");
        return zDPRepository.findAll();
    }

    /**
     * {@code GET  /zdps/:id} : get the "id" zDP.
     *
     * @param id the id of the zDP to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the zDP, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/zdps/{id}")
    public ResponseEntity<ZDP> getZDP(@PathVariable Long id) {
        log.debug("REST request to get ZDP : {}", id);
        Optional<ZDP> zDP = zDPRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(zDP);
    }

    /**
     * {@code DELETE  /zdps/:id} : delete the "id" zDP.
     *
     * @param id the id of the zDP to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/zdps/{id}")
    public ResponseEntity<Void> deleteZDP(@PathVariable Long id) {
        log.debug("REST request to delete ZDP : {}", id);
        zDPRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
