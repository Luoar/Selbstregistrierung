package ch.luoar.selbstregistrierung.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ch.luoar.selbstregistrierung.IntegrationTest;
import ch.luoar.selbstregistrierung.domain.Adresse;
import ch.luoar.selbstregistrierung.domain.enumeration.Adresstyp;
import ch.luoar.selbstregistrierung.repository.AdresseRepository;
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
 * Integration tests for the {@link AdresseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdresseResourceIT {

    private static final String DEFAULT_STRASSE_UND_NUMMER = "AAAAAAAAAA";
    private static final String UPDATED_STRASSE_UND_NUMMER = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSZUSATZ = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSZUSATZ = "BBBBBBBBBB";

    private static final String DEFAULT_POSTFACH = "AAAAAAAAAA";
    private static final String UPDATED_POSTFACH = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFON_FIX = "AAAAAAAAAA";
    private static final String UPDATED_TELEFON_FIX = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFON_GESCHAEFT = "AAAAAAAAAA";
    private static final String UPDATED_TELEFON_GESCHAEFT = "BBBBBBBBBB";

    private static final String DEFAULT_FAX = "AAAAAAAAAA";
    private static final String UPDATED_FAX = "BBBBBBBBBB";

    private static final Adresstyp DEFAULT_ADRESSTYP = Adresstyp.Domizil;
    private static final Adresstyp UPDATED_ADRESSTYP = Adresstyp.Korrespondenz;

    private static final String ENTITY_API_URL = "/api/adresses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdresseRepository adresseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdresseMockMvc;

    private Adresse adresse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Adresse createEntity(EntityManager em) {
        Adresse adresse = new Adresse()
            .strasseUndNummer(DEFAULT_STRASSE_UND_NUMMER)
            .adresszusatz(DEFAULT_ADRESSZUSATZ)
            .postfach(DEFAULT_POSTFACH)
            .telefonFix(DEFAULT_TELEFON_FIX)
            .telefonGeschaeft(DEFAULT_TELEFON_GESCHAEFT)
            .fax(DEFAULT_FAX)
            .adresstyp(DEFAULT_ADRESSTYP);
        return adresse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Adresse createUpdatedEntity(EntityManager em) {
        Adresse adresse = new Adresse()
            .strasseUndNummer(UPDATED_STRASSE_UND_NUMMER)
            .adresszusatz(UPDATED_ADRESSZUSATZ)
            .postfach(UPDATED_POSTFACH)
            .telefonFix(UPDATED_TELEFON_FIX)
            .telefonGeschaeft(UPDATED_TELEFON_GESCHAEFT)
            .fax(UPDATED_FAX)
            .adresstyp(UPDATED_ADRESSTYP);
        return adresse;
    }

    @BeforeEach
    public void initTest() {
        adresse = createEntity(em);
    }

    @Test
    @Transactional
    void createAdresse() throws Exception {
        int databaseSizeBeforeCreate = adresseRepository.findAll().size();
        // Create the Adresse
        restAdresseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(adresse)))
            .andExpect(status().isCreated());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeCreate + 1);
        Adresse testAdresse = adresseList.get(adresseList.size() - 1);
        assertThat(testAdresse.getStrasseUndNummer()).isEqualTo(DEFAULT_STRASSE_UND_NUMMER);
        assertThat(testAdresse.getAdresszusatz()).isEqualTo(DEFAULT_ADRESSZUSATZ);
        assertThat(testAdresse.getPostfach()).isEqualTo(DEFAULT_POSTFACH);
        assertThat(testAdresse.getTelefonFix()).isEqualTo(DEFAULT_TELEFON_FIX);
        assertThat(testAdresse.getTelefonGeschaeft()).isEqualTo(DEFAULT_TELEFON_GESCHAEFT);
        assertThat(testAdresse.getFax()).isEqualTo(DEFAULT_FAX);
        assertThat(testAdresse.getAdresstyp()).isEqualTo(DEFAULT_ADRESSTYP);
    }

    @Test
    @Transactional
    void createAdresseWithExistingId() throws Exception {
        // Create the Adresse with an existing ID
        adresse.setId(1L);

        int databaseSizeBeforeCreate = adresseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdresseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(adresse)))
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdresses() throws Exception {
        // Initialize the database
        adresseRepository.saveAndFlush(adresse);

        // Get all the adresseList
        restAdresseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adresse.getId().intValue())))
            .andExpect(jsonPath("$.[*].strasseUndNummer").value(hasItem(DEFAULT_STRASSE_UND_NUMMER)))
            .andExpect(jsonPath("$.[*].adresszusatz").value(hasItem(DEFAULT_ADRESSZUSATZ)))
            .andExpect(jsonPath("$.[*].postfach").value(hasItem(DEFAULT_POSTFACH)))
            .andExpect(jsonPath("$.[*].telefonFix").value(hasItem(DEFAULT_TELEFON_FIX)))
            .andExpect(jsonPath("$.[*].telefonGeschaeft").value(hasItem(DEFAULT_TELEFON_GESCHAEFT)))
            .andExpect(jsonPath("$.[*].fax").value(hasItem(DEFAULT_FAX)))
            .andExpect(jsonPath("$.[*].adresstyp").value(hasItem(DEFAULT_ADRESSTYP.toString())));
    }

    @Test
    @Transactional
    void getAdresse() throws Exception {
        // Initialize the database
        adresseRepository.saveAndFlush(adresse);

        // Get the adresse
        restAdresseMockMvc
            .perform(get(ENTITY_API_URL_ID, adresse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adresse.getId().intValue()))
            .andExpect(jsonPath("$.strasseUndNummer").value(DEFAULT_STRASSE_UND_NUMMER))
            .andExpect(jsonPath("$.adresszusatz").value(DEFAULT_ADRESSZUSATZ))
            .andExpect(jsonPath("$.postfach").value(DEFAULT_POSTFACH))
            .andExpect(jsonPath("$.telefonFix").value(DEFAULT_TELEFON_FIX))
            .andExpect(jsonPath("$.telefonGeschaeft").value(DEFAULT_TELEFON_GESCHAEFT))
            .andExpect(jsonPath("$.fax").value(DEFAULT_FAX))
            .andExpect(jsonPath("$.adresstyp").value(DEFAULT_ADRESSTYP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAdresse() throws Exception {
        // Get the adresse
        restAdresseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAdresse() throws Exception {
        // Initialize the database
        adresseRepository.saveAndFlush(adresse);

        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();

        // Update the adresse
        Adresse updatedAdresse = adresseRepository.findById(adresse.getId()).get();
        // Disconnect from session so that the updates on updatedAdresse are not directly saved in db
        em.detach(updatedAdresse);
        updatedAdresse
            .strasseUndNummer(UPDATED_STRASSE_UND_NUMMER)
            .adresszusatz(UPDATED_ADRESSZUSATZ)
            .postfach(UPDATED_POSTFACH)
            .telefonFix(UPDATED_TELEFON_FIX)
            .telefonGeschaeft(UPDATED_TELEFON_GESCHAEFT)
            .fax(UPDATED_FAX)
            .adresstyp(UPDATED_ADRESSTYP);

        restAdresseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdresse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdresse))
            )
            .andExpect(status().isOk());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
        Adresse testAdresse = adresseList.get(adresseList.size() - 1);
        assertThat(testAdresse.getStrasseUndNummer()).isEqualTo(UPDATED_STRASSE_UND_NUMMER);
        assertThat(testAdresse.getAdresszusatz()).isEqualTo(UPDATED_ADRESSZUSATZ);
        assertThat(testAdresse.getPostfach()).isEqualTo(UPDATED_POSTFACH);
        assertThat(testAdresse.getTelefonFix()).isEqualTo(UPDATED_TELEFON_FIX);
        assertThat(testAdresse.getTelefonGeschaeft()).isEqualTo(UPDATED_TELEFON_GESCHAEFT);
        assertThat(testAdresse.getFax()).isEqualTo(UPDATED_FAX);
        assertThat(testAdresse.getAdresstyp()).isEqualTo(UPDATED_ADRESSTYP);
    }

    @Test
    @Transactional
    void putNonExistingAdresse() throws Exception {
        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();
        adresse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adresse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adresse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdresse() throws Exception {
        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();
        adresse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adresse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdresse() throws Exception {
        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();
        adresse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(adresse)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdresseWithPatch() throws Exception {
        // Initialize the database
        adresseRepository.saveAndFlush(adresse);

        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();

        // Update the adresse using partial update
        Adresse partialUpdatedAdresse = new Adresse();
        partialUpdatedAdresse.setId(adresse.getId());

        partialUpdatedAdresse
            .strasseUndNummer(UPDATED_STRASSE_UND_NUMMER)
            .adresszusatz(UPDATED_ADRESSZUSATZ)
            .postfach(UPDATED_POSTFACH)
            .telefonFix(UPDATED_TELEFON_FIX)
            .fax(UPDATED_FAX);

        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdresse))
            )
            .andExpect(status().isOk());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
        Adresse testAdresse = adresseList.get(adresseList.size() - 1);
        assertThat(testAdresse.getStrasseUndNummer()).isEqualTo(UPDATED_STRASSE_UND_NUMMER);
        assertThat(testAdresse.getAdresszusatz()).isEqualTo(UPDATED_ADRESSZUSATZ);
        assertThat(testAdresse.getPostfach()).isEqualTo(UPDATED_POSTFACH);
        assertThat(testAdresse.getTelefonFix()).isEqualTo(UPDATED_TELEFON_FIX);
        assertThat(testAdresse.getTelefonGeschaeft()).isEqualTo(DEFAULT_TELEFON_GESCHAEFT);
        assertThat(testAdresse.getFax()).isEqualTo(UPDATED_FAX);
        assertThat(testAdresse.getAdresstyp()).isEqualTo(DEFAULT_ADRESSTYP);
    }

    @Test
    @Transactional
    void fullUpdateAdresseWithPatch() throws Exception {
        // Initialize the database
        adresseRepository.saveAndFlush(adresse);

        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();

        // Update the adresse using partial update
        Adresse partialUpdatedAdresse = new Adresse();
        partialUpdatedAdresse.setId(adresse.getId());

        partialUpdatedAdresse
            .strasseUndNummer(UPDATED_STRASSE_UND_NUMMER)
            .adresszusatz(UPDATED_ADRESSZUSATZ)
            .postfach(UPDATED_POSTFACH)
            .telefonFix(UPDATED_TELEFON_FIX)
            .telefonGeschaeft(UPDATED_TELEFON_GESCHAEFT)
            .fax(UPDATED_FAX)
            .adresstyp(UPDATED_ADRESSTYP);

        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdresse))
            )
            .andExpect(status().isOk());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
        Adresse testAdresse = adresseList.get(adresseList.size() - 1);
        assertThat(testAdresse.getStrasseUndNummer()).isEqualTo(UPDATED_STRASSE_UND_NUMMER);
        assertThat(testAdresse.getAdresszusatz()).isEqualTo(UPDATED_ADRESSZUSATZ);
        assertThat(testAdresse.getPostfach()).isEqualTo(UPDATED_POSTFACH);
        assertThat(testAdresse.getTelefonFix()).isEqualTo(UPDATED_TELEFON_FIX);
        assertThat(testAdresse.getTelefonGeschaeft()).isEqualTo(UPDATED_TELEFON_GESCHAEFT);
        assertThat(testAdresse.getFax()).isEqualTo(UPDATED_FAX);
        assertThat(testAdresse.getAdresstyp()).isEqualTo(UPDATED_ADRESSTYP);
    }

    @Test
    @Transactional
    void patchNonExistingAdresse() throws Exception {
        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();
        adresse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adresse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adresse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdresse() throws Exception {
        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();
        adresse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adresse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdresse() throws Exception {
        int databaseSizeBeforeUpdate = adresseRepository.findAll().size();
        adresse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(adresse)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Adresse in the database
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdresse() throws Exception {
        // Initialize the database
        adresseRepository.saveAndFlush(adresse);

        int databaseSizeBeforeDelete = adresseRepository.findAll().size();

        // Delete the adresse
        restAdresseMockMvc
            .perform(delete(ENTITY_API_URL_ID, adresse.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Adresse> adresseList = adresseRepository.findAll();
        assertThat(adresseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
