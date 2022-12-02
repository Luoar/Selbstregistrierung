package ch.luoar.selbstregistrierung.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ch.luoar.selbstregistrierung.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ZDPTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ZDP.class);
        ZDP zDP1 = new ZDP();
        zDP1.setId(1L);
        ZDP zDP2 = new ZDP();
        zDP2.setId(zDP1.getId());
        assertThat(zDP1).isEqualTo(zDP2);
        zDP2.setId(2L);
        assertThat(zDP1).isNotEqualTo(zDP2);
        zDP1.setId(null);
        assertThat(zDP1).isNotEqualTo(zDP2);
    }
}
