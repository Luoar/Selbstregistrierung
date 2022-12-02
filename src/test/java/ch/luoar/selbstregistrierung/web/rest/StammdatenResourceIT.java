package ch.luoar.selbstregistrierung.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ch.luoar.selbstregistrierung.IntegrationTest;
import ch.luoar.selbstregistrierung.domain.Stammdaten;
import ch.luoar.selbstregistrierung.domain.enumeration.Anrede;
import ch.luoar.selbstregistrierung.repository.StammdatenRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StammdatenResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StammdatenResourceIT {

    private static final Anrede DEFAULT_ANREDE = Anrede.Herr;
    private static final Anrede UPDATED_ANREDE = Anrede.Frau;

    private static final String DEFAULT_NACHNAME = "AAAAAAAAAA";
    private static final String UPDATED_NACHNAME = "BBBBBBBBBB";

    private static final String DEFAULT_VORNAME = "AAAAAAAAAA";
    private static final String UPDATED_VORNAME = "BBBBBBBBBB";

    private static final String DEFAULT_E_MAIL = "AAAAAAAAAA";
    private static final String UPDATED_E_MAIL = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFON_MOBILE = "AAAAAAAAAA";
    private static final String UPDATED_TELEFON_MOBILE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stammdatens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StammdatenRepository stammdatenRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStammdatenMockMvc;

    private Stammdaten stammdaten;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stammdaten createEntity(EntityManager em) {
        Stammdaten stammdaten = new Stammdaten()
            .anrede(DEFAULT_ANREDE)
            .nachname(DEFAULT_NACHNAME)
            .vorname(DEFAULT_VORNAME)
            .eMail(DEFAULT_E_MAIL)
            .telefonMobile(DEFAULT_TELEFON_MOBILE);
        return stammdaten;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stammdaten createUpdatedEntity(EntityManager em) {
        Stammdaten stammdaten = new Stammdaten()
            .anrede(UPDATED_ANREDE)
            .nachname(UPDATED_NACHNAME)
            .vorname(UPDATED_VORNAME)
            .eMail(UPDATED_E_MAIL)
            .telefonMobile(UPDATED_TELEFON_MOBILE);
        return stammdaten;
    }

    @BeforeEach
    public void initTest() {
        stammdaten = createEntity(em);
    }

    @Test
    @Transactional
    void createStammdaten() throws Exception {
        int databaseSizeBeforeCreate = stammdatenRepository.findAll().size();
        // Create the Stammdaten
        restStammdatenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stammdaten)))
            .andExpect(status().isCreated());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeCreate + 1);
        Stammdaten testStammdaten = stammdatenList.get(stammdatenList.size() - 1);
        assertThat(testStammdaten.getAnrede()).isEqualTo(DEFAULT_ANREDE);
        assertThat(testStammdaten.getNachname()).isEqualTo(DEFAULT_NACHNAME);
        assertThat(testStammdaten.getVorname()).isEqualTo(DEFAULT_VORNAME);
        assertThat(testStammdaten.geteMail()).isEqualTo(DEFAULT_E_MAIL);
        assertThat(testStammdaten.getTelefonMobile()).isEqualTo(DEFAULT_TELEFON_MOBILE);
    }

    @Test
    @Transactional
    void createStammdatenWithExistingId() throws Exception {
        // Create the Stammdaten with an existing ID
        stammdaten.setId(1L);

        int databaseSizeBeforeCreate = stammdatenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStammdatenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stammdaten)))
            .andExpect(status().isBadRequest());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStammdatens() throws Exception {
        // Initialize the database
        stammdatenRepository.saveAndFlush(stammdaten);

        // Get all the stammdatenList
        restStammdatenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stammdaten.getId().intValue())))
            .andExpect(jsonPath("$.[*].anrede").value(hasItem(DEFAULT_ANREDE.toString())))
            .andExpect(jsonPath("$.[*].nachname").value(hasItem(DEFAULT_NACHNAME)))
            .andExpect(jsonPath("$.[*].vorname").value(hasItem(DEFAULT_VORNAME)))
            .andExpect(jsonPath("$.[*].eMail").value(hasItem(DEFAULT_E_MAIL)))
            .andExpect(jsonPath("$.[*].telefonMobile").value(hasItem(DEFAULT_TELEFON_MOBILE)));
    }

    @Test
    @Transactional
    void getStammdaten() throws Exception {
        // Initialize the database
        stammdatenRepository.saveAndFlush(stammdaten);

        // Get the stammdaten
        restStammdatenMockMvc
            .perform(get(ENTITY_API_URL_ID, stammdaten.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stammdaten.getId().intValue()))
            .andExpect(jsonPath("$.anrede").value(DEFAULT_ANREDE.toString()))
            .andExpect(jsonPath("$.nachname").value(DEFAULT_NACHNAME))
            .andExpect(jsonPath("$.vorname").value(DEFAULT_VORNAME))
            .andExpect(jsonPath("$.eMail").value(DEFAULT_E_MAIL))
            .andExpect(jsonPath("$.telefonMobile").value(DEFAULT_TELEFON_MOBILE));
    }

    @Test
    @Transactional
    void getNonExistingStammdaten() throws Exception {
        // Get the stammdaten
        restStammdatenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStammdaten() throws Exception {
        // Initialize the database
        stammdatenRepository.saveAndFlush(stammdaten);

        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();

        // Update the stammdaten
        Stammdaten updatedStammdaten = stammdatenRepository.findById(stammdaten.getId()).get();
        // Disconnect from session so that the updates on updatedStammdaten are not directly saved in db
        em.detach(updatedStammdaten);
        updatedStammdaten
            .anrede(UPDATED_ANREDE)
            .nachname(UPDATED_NACHNAME)
            .vorname(UPDATED_VORNAME)
            .eMail(UPDATED_E_MAIL)
            .telefonMobile(UPDATED_TELEFON_MOBILE);

        restStammdatenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStammdaten.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStammdaten))
            )
            .andExpect(status().isOk());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
        Stammdaten testStammdaten = stammdatenList.get(stammdatenList.size() - 1);
        assertThat(testStammdaten.getAnrede()).isEqualTo(UPDATED_ANREDE);
        assertThat(testStammdaten.getNachname()).isEqualTo(UPDATED_NACHNAME);
        assertThat(testStammdaten.getVorname()).isEqualTo(UPDATED_VORNAME);
        assertThat(testStammdaten.geteMail()).isEqualTo(UPDATED_E_MAIL);
        assertThat(testStammdaten.getTelefonMobile()).isEqualTo(UPDATED_TELEFON_MOBILE);
    }

    @Test
    @Transactional
    void putNonExistingStammdaten() throws Exception {
        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();
        stammdaten.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStammdatenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stammdaten.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stammdaten))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStammdaten() throws Exception {
        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();
        stammdaten.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStammdatenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stammdaten))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStammdaten() throws Exception {
        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();
        stammdaten.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStammdatenMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stammdaten)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStammdatenWithPatch() throws Exception {
        // Initialize the database
        stammdatenRepository.saveAndFlush(stammdaten);

        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();

        // Update the stammdaten using partial update
        Stammdaten partialUpdatedStammdaten = new Stammdaten();
        partialUpdatedStammdaten.setId(stammdaten.getId());

        partialUpdatedStammdaten.nachname(UPDATED_NACHNAME).vorname(UPDATED_VORNAME);

        restStammdatenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStammdaten.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStammdaten))
            )
            .andExpect(status().isOk());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
        Stammdaten testStammdaten = stammdatenList.get(stammdatenList.size() - 1);
        assertThat(testStammdaten.getAnrede()).isEqualTo(DEFAULT_ANREDE);
        assertThat(testStammdaten.getNachname()).isEqualTo(UPDATED_NACHNAME);
        assertThat(testStammdaten.getVorname()).isEqualTo(UPDATED_VORNAME);
        assertThat(testStammdaten.geteMail()).isEqualTo(DEFAULT_E_MAIL);
        assertThat(testStammdaten.getTelefonMobile()).isEqualTo(DEFAULT_TELEFON_MOBILE);
    }

    @Test
    @Transactional
    void fullUpdateStammdatenWithPatch() throws Exception {
        // Initialize the database
        stammdatenRepository.saveAndFlush(stammdaten);

        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();

        // Update the stammdaten using partial update
        Stammdaten partialUpdatedStammdaten = new Stammdaten();
        partialUpdatedStammdaten.setId(stammdaten.getId());

        partialUpdatedStammdaten
            .anrede(UPDATED_ANREDE)
            .nachname(UPDATED_NACHNAME)
            .vorname(UPDATED_VORNAME)
            .eMail(UPDATED_E_MAIL)
            .telefonMobile(UPDATED_TELEFON_MOBILE);

        restStammdatenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStammdaten.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStammdaten))
            )
            .andExpect(status().isOk());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
        Stammdaten testStammdaten = stammdatenList.get(stammdatenList.size() - 1);
        assertThat(testStammdaten.getAnrede()).isEqualTo(UPDATED_ANREDE);
        assertThat(testStammdaten.getNachname()).isEqualTo(UPDATED_NACHNAME);
        assertThat(testStammdaten.getVorname()).isEqualTo(UPDATED_VORNAME);
        assertThat(testStammdaten.geteMail()).isEqualTo(UPDATED_E_MAIL);
        assertThat(testStammdaten.getTelefonMobile()).isEqualTo(UPDATED_TELEFON_MOBILE);
    }

    @Test
    @Transactional
    void patchNonExistingStammdaten() throws Exception {
        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();
        stammdaten.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStammdatenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stammdaten.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stammdaten))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStammdaten() throws Exception {
        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();
        stammdaten.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStammdatenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stammdaten))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStammdaten() throws Exception {
        int databaseSizeBeforeUpdate = stammdatenRepository.findAll().size();
        stammdaten.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStammdatenMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stammdaten))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stammdaten in the database
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStammdaten() throws Exception {
        // Initialize the database
        stammdatenRepository.saveAndFlush(stammdaten);

        int databaseSizeBeforeDelete = stammdatenRepository.findAll().size();

        // Delete the stammdaten
        restStammdatenMockMvc
            .perform(delete(ENTITY_API_URL_ID, stammdaten.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stammdaten> stammdatenList = stammdatenRepository.findAll();
        assertThat(stammdatenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
