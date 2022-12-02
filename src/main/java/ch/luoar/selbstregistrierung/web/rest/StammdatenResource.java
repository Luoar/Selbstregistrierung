package ch.luoar.selbstregistrierung.web.rest;

import ch.luoar.selbstregistrierung.domain.Stammdaten;
import ch.luoar.selbstregistrierung.repository.StammdatenRepository;
import ch.luoar.selbstregistrierung.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ch.luoar.selbstregistrierung.domain.Stammdaten}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StammdatenResource {

    private final Logger log = LoggerFactory.getLogger(StammdatenResource.class);

    private static final String ENTITY_NAME = "stammdaten";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StammdatenRepository stammdatenRepository;

    public StammdatenResource(StammdatenRepository stammdatenRepository) {
        this.stammdatenRepository = stammdatenRepository;
    }

    /**
     * {@code POST  /stammdatens} : Create a new stammdaten.
     *
     * @param stammdaten the stammdaten to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stammdaten, or with status {@code 400 (Bad Request)} if the stammdaten has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stammdatens")
    public ResponseEntity<Stammdaten> createStammdaten(@RequestBody Stammdaten stammdaten) throws URISyntaxException {
        log.debug("REST request to save Stammdaten : {}", stammdaten);
        if (stammdaten.getId() != null) {
            throw new BadRequestAlertException("A new stammdaten cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stammdaten result = stammdatenRepository.save(stammdaten);
        return ResponseEntity
            .created(new URI("/api/stammdatens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stammdatens/:id} : Updates an existing stammdaten.
     *
     * @param id the id of the stammdaten to save.
     * @param stammdaten the stammdaten to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stammdaten,
     * or with status {@code 400 (Bad Request)} if the stammdaten is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stammdaten couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stammdatens/{id}")
    public ResponseEntity<Stammdaten> updateStammdaten(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Stammdaten stammdaten
    ) throws URISyntaxException {
        log.debug("REST request to update Stammdaten : {}, {}", id, stammdaten);
        if (stammdaten.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stammdaten.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stammdatenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Stammdaten result = stammdatenRepository.save(stammdaten);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stammdaten.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stammdatens/:id} : Partial updates given fields of an existing stammdaten, field will ignore if it is null
     *
     * @param id the id of the stammdaten to save.
     * @param stammdaten the stammdaten to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stammdaten,
     * or with status {@code 400 (Bad Request)} if the stammdaten is not valid,
     * or with status {@code 404 (Not Found)} if the stammdaten is not found,
     * or with status {@code 500 (Internal Server Error)} if the stammdaten couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/stammdatens/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Stammdaten> partialUpdateStammdaten(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Stammdaten stammdaten
    ) throws URISyntaxException {
        log.debug("REST request to partial update Stammdaten partially : {}, {}", id, stammdaten);
        if (stammdaten.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stammdaten.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stammdatenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Stammdaten> result = stammdatenRepository
            .findById(stammdaten.getId())
            .map(existingStammdaten -> {
                if (stammdaten.getAnrede() != null) {
                    existingStammdaten.setAnrede(stammdaten.getAnrede());
                }
                if (stammdaten.getNachname() != null) {
                    existingStammdaten.setNachname(stammdaten.getNachname());
                }
                if (stammdaten.getVorname() != null) {
                    existingStammdaten.setVorname(stammdaten.getVorname());
                }
                if (stammdaten.geteMail() != null) {
                    existingStammdaten.seteMail(stammdaten.geteMail());
                }
                if (stammdaten.getTelefonMobile() != null) {
                    existingStammdaten.setTelefonMobile(stammdaten.getTelefonMobile());
                }

                return existingStammdaten;
            })
            .map(stammdatenRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stammdaten.getId().toString())
        );
    }

    /**
     * {@code GET  /stammdatens} : get all the stammdatens.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stammdatens in body.
     */
    @GetMapping("/stammdatens")
    public List<Stammdaten> getAllStammdatens(@RequestParam(required = false) String filter) {
        if ("zdp-is-null".equals(filter)) {
            log.debug("REST request to get all Stammdatens where zDP is null");
            return StreamSupport
                .stream(stammdatenRepository.findAll().spliterator(), false)
                .filter(stammdaten -> stammdaten.getZDP() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Stammdatens");
        return stammdatenRepository.findAll();
    }

    /**
     * {@code GET  /stammdatens/:id} : get the "id" stammdaten.
     *
     * @param id the id of the stammdaten to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stammdaten, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stammdatens/{id}")
    public ResponseEntity<Stammdaten> getStammdaten(@PathVariable Long id) {
        log.debug("REST request to get Stammdaten : {}", id);
        Optional<Stammdaten> stammdaten = stammdatenRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stammdaten);
    }

    /**
     * {@code DELETE  /stammdatens/:id} : delete the "id" stammdaten.
     *
     * @param id the id of the stammdaten to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stammdatens/{id}")
    public ResponseEntity<Void> deleteStammdaten(@PathVariable Long id) {
        log.debug("REST request to delete Stammdaten : {}", id);
        stammdatenRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
