<template>
  <div v-if="data" id="card-slider" class="card-slider article">
    <div
      :class="{
        'card-slider__fixed-element-container': true,
        'article': true,
        'el--bottom': status.bottomFlag,
        'el--fixed': status.fixedFlag,
      }"
    >
      <!-- Line Chart -->
      <div class="card-slider__line-chart-container">
        <LineChart />
      </div>

      <!-- Side Anchor -->
      <div
        :class="{
          'card-slider__side-anchor-container': true,
          'card-slider__side-anchor-container--at-bottom': status.bottomFlag,
        }"
      >
        <SideAnchor :time="anchorTime" />
      </div>
    </div>

    <!-- Card Slider -->
    <div class="card-slider__cards-container">
      <div
        v-for="(year, index_y) in Object.keys(data.epidemic)" :key="index_y"
        class="card-slider__years-container"
      >
        <div
          v-for="(month, index_m) in Object.keys(data.epidemic[year])" :key="index_m"
          class="card-slider__months-container"
        >
          <div
            v-for="(day, index_d) in Object.values(data.epidemic[year][month].date)" :key="index_d"
            class="card-slider__days-container"
          >
            <DayCard
              :date="[month, day.day, year]"
              :data="day"
              :useAbstract="+index_d === 0"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="card-slider">
    <div class="card-slider__loading">loading...</div>
  </div>
</template>

<script>
import DayCard from './DayCard.vue';
import LineChart from './LineChart.vue';
import SideAnchor from './SideAnchor.vue';

export default {
  name: 'CardSlider',
  components: {
    DayCard,
    LineChart,
    SideAnchor,
  },
  data() {
    return {
      status: {
        ticking: false,
        fixedFlag: false,
        bottomFlag: false,
      },
    };
  },
  computed: {
    data() {
      return this.$store.state.data;
    },
    anchorTime() {
      if (!this.$store.state.data) return null;

      const epidemic = this.$store.state.data.epidemic;
      const time = {};
      const yearsList = Object.keys(epidemic);
      yearsList.forEach(e => {
        const monthsList = Object.keys(epidemic[e]);
        time[e] = monthsList;
      });

      return time;
    }
  },
  methods: {
    sliderFixedEvent() {
      const slider = document.getElementById('card-slider');
      if (!slider) return;
      
      /* determine whether enter card slider or not */
      const pos = slider.getBoundingClientRect();
      if (pos.top < 0 && pos.bottom > 0) {
        this.status.fixedFlag = true;
        this.status.bottomFlag = false;
      } else {
        this.status.fixedFlag = false;
        if (pos.top < 0 && pos.bottom < 0) this.status.bottomFlag = true;
      }
    },
    handleScroll() {
      if (!this.status.ticking) {
        window.requestAnimationFrame(() => {
          this.sliderFixedEvent();
          this.status.ticking = false;
        });
      }
      this.status.ticking = true;
    },
  },
  mounted() {
    document.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    document.removeEventListener('scroll', this.handleScroll, true);
  },
}
</script>

<style lang="scss" scoped>
@import '~/style/_mixins.scss';
@import '~/style/_variables.scss';
.card-slider {
  position: relative;
  z-index: 5000;
  padding-top: $lineChartHeight-mob;
  margin-bottom: $lineChartHeight-mob;
  @include pc {
    padding-top: $lineChartHeight-pc;
    margin-bottom: $lineChartHeight-pc;
  }
  .card-slider__loading {
    text-align: center;
  }
}
.card-slider__fixed-element-container {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  padding: 0;
  @include pad {
    left: auto;
  }
  @include pc {
    left: auto;
  }

  &.el--bottom {
    top: 100%;
  }
  &.el--fixed {
    position: fixed;
    top: 0;
  }

  .card-slider__line-chart-container {
    position: relative;
    z-index: 5;
    width: 100%;
    background-color: #ffffff;
  }
  .card-slider__side-anchor-container {
    position: absolute;
    z-index: 4;
    top: 218px;
    right: 8px;
    transform: translate(0, 0);
    transition: .666s ease-in-out;
    @include smob {
      top: 200px;
    }
    @include pad {
      right: -16px;
      transform: translate(100%, 0);
    }
    @include pc {
      right: -16px;
      top: 300px;
      transform: translate(100%, 0);
    }

    &.card-slider__side-anchor-container--at-bottom {
      pointer-events: none;
      opacity: 0;
      transform: translate(0, -125%);
      @include pad {
        transform: translate(100%, -125%);
      }
      @include pc {
        transform: translate(100%, -125%);
      }
    }
  }
}

.card-slider__cards-container {
  position: relative;
  z-index: 5;
  padding-right: 32px;
  @include pad {
    padding: 0 24px;
  }
  @include pc {
    padding: 0 24px;
  }
}
</style>