package ch.luoar.selbstregistrierung.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ch.luoar.selbstregistrierung.IntegrationTest;
import ch.luoar.selbstregistrierung.domain.ZDP;
import ch.luoar.selbstregistrierung.repository.ZDPRepository;
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
 * Integration tests for the {@link ZDPResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ZDPResourceIT {

    private static final Integer DEFAULT_ZDP_NUMMER = 1;
    private static final Integer UPDATED_ZDP_NUMMER = 2;

    private static final String ENTITY_API_URL = "/api/zdps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ZDPRepository zDPRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restZDPMockMvc;

    private ZDP zDP;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ZDP createEntity(EntityManager em) {
        ZDP zDP = new ZDP().zdpNummer(DEFAULT_ZDP_NUMMER);
        return zDP;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ZDP createUpdatedEntity(EntityManager em) {
        ZDP zDP = new ZDP().zdpNummer(UPDATED_ZDP_NUMMER);
        return zDP;
    }

    @BeforeEach
    public void initTest() {
        zDP = createEntity(em);
    }

    @Test
    @Transactional
    void createZDP() throws Exception {
        int databaseSizeBeforeCreate = zDPRepository.findAll().size();
        // Create the ZDP
        restZDPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zDP)))
            .andExpect(status().isCreated());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeCreate + 1);
        ZDP testZDP = zDPList.get(zDPList.size() - 1);
        assertThat(testZDP.getZdpNummer()).isEqualTo(DEFAULT_ZDP_NUMMER);
    }

    @Test
    @Transactional
    void createZDPWithExistingId() throws Exception {
        // Create the ZDP with an existing ID
        zDP.setId(1L);

        int databaseSizeBeforeCreate = zDPRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restZDPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zDP)))
            .andExpect(status().isBadRequest());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllZDPS() throws Exception {
        // Initialize the database
        zDPRepository.saveAndFlush(zDP);

        // Get all the zDPList
        restZDPMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(zDP.getId().intValue())))
            .andExpect(jsonPath("$.[*].zdpNummer").value(hasItem(DEFAULT_ZDP_NUMMER)));
    }

    @Test
    @Transactional
    void getZDP() throws Exception {
        // Initialize the database
        zDPRepository.saveAndFlush(zDP);

        // Get the zDP
        restZDPMockMvc
            .perform(get(ENTITY_API_URL_ID, zDP.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(zDP.getId().intValue()))
            .andExpect(jsonPath("$.zdpNummer").value(DEFAULT_ZDP_NUMMER));
    }

    @Test
    @Transactional
    void getNonExistingZDP() throws Exception {
        // Get the zDP
        restZDPMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingZDP() throws Exception {
        // Initialize the database
        zDPRepository.saveAndFlush(zDP);

        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();

        // Update the zDP
        ZDP updatedZDP = zDPRepository.findById(zDP.getId()).get();
        // Disconnect from session so that the updates on updatedZDP are not directly saved in db
        em.detach(updatedZDP);
        updatedZDP.zdpNummer(UPDATED_ZDP_NUMMER);

        restZDPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedZDP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedZDP))
            )
            .andExpect(status().isOk());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
        ZDP testZDP = zDPList.get(zDPList.size() - 1);
        assertThat(testZDP.getZdpNummer()).isEqualTo(UPDATED_ZDP_NUMMER);
    }

    @Test
    @Transactional
    void putNonExistingZDP() throws Exception {
        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();
        zDP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restZDPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, zDP.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zDP))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchZDP() throws Exception {
        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();
        zDP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZDPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(zDP))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamZDP() throws Exception {
        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();
        zDP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZDPMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zDP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateZDPWithPatch() throws Exception {
        // Initialize the database
        zDPRepository.saveAndFlush(zDP);

        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();

        // Update the zDP using partial update
        ZDP partialUpdatedZDP = new ZDP();
        partialUpdatedZDP.setId(zDP.getId());

        partialUpdatedZDP.zdpNummer(UPDATED_ZDP_NUMMER);

        restZDPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedZDP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedZDP))
            )
            .andExpect(status().isOk());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
        ZDP testZDP = zDPList.get(zDPList.size() - 1);
        assertThat(testZDP.getZdpNummer()).isEqualTo(UPDATED_ZDP_NUMMER);
    }

    @Test
    @Transactional
    void fullUpdateZDPWithPatch() throws Exception {
        // Initialize the database
        zDPRepository.saveAndFlush(zDP);

        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();

        // Update the zDP using partial update
        ZDP partialUpdatedZDP = new ZDP();
        partialUpdatedZDP.setId(zDP.getId());

        partialUpdatedZDP.zdpNummer(UPDATED_ZDP_NUMMER);

        restZDPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedZDP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedZDP))
            )
            .andExpect(status().isOk());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
        ZDP testZDP = zDPList.get(zDPList.size() - 1);
        assertThat(testZDP.getZdpNummer()).isEqualTo(UPDATED_ZDP_NUMMER);
    }

    @Test
    @Transactional
    void patchNonExistingZDP() throws Exception {
        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();
        zDP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restZDPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, zDP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(zDP))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchZDP() throws Exception {
        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();
        zDP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZDPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(zDP))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamZDP() throws Exception {
        int databaseSizeBeforeUpdate = zDPRepository.findAll().size();
        zDP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZDPMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(zDP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ZDP in the database
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteZDP() throws Exception {
        // Initialize the database
        zDPRepository.saveAndFlush(zDP);

        int databaseSizeBeforeDelete = zDPRepository.findAll().size();

        // Delete the zDP
        restZDPMockMvc.perform(delete(ENTITY_API_URL_ID, zDP.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ZDP> zDPList = zDPRepository.findAll();
        assertThat(zDPList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
