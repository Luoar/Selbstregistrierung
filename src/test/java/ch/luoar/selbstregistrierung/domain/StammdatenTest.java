package ch.luoar.selbstregistrierung.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ch.luoar.selbstregistrierung.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StammdatenTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stammdaten.class);
        Stammdaten stammdaten1 = new Stammdaten();
        stammdaten1.setId(1L);
        Stammdaten stammdaten2 = new Stammdaten();
        stammdaten2.setId(stammdaten1.getId());
        assertThat(stammdaten1).isEqualTo(stammdaten2);
        stammdaten2.setId(2L);
        assertThat(stammdaten1).isNotEqualTo(stammdaten2);
        stammdaten1.setId(null);
        assertThat(stammdaten1).isNotEqualTo(stammdaten2);
    }
}
