<template>
    <li :class="classList" @mouseover="mouseover(itemName,$event)" @mouseout="mouseout(itemName,$event)">
        <slot></slot>
    </li>
</template>

<style lang="scss">
    .nav-item {
        position: relative;
    }

    .sidebar-hidden {
        .nav-item:hover {
            .nav-tooltip-popper {
                display: block;
            }
        }
    }
</style>

<script>
  export default {
    name: 'sidebar-nav-item',
    props: {
      classes: {
        type: String,
        default: '',
      },
      itemName: {
        type: String,
        default: '',
      }
    },
    computed: {
      classList() {
        return [
          'nav-item',
          ...this.itemClasses,
        ];
      },
      itemClasses() {
        return this.classes ? this.classes.split(' ') : '';
      },
    },
    methods: {
      mouseover(itemName, event) {
        let width = document.querySelector('.sidebar').clientWidth,
            top = event.currentTarget.offsetTop - document.querySelector('.sidebar-nav').scrollTop;
        if (width === 65 && itemName) {
          document.getElementById('tooltip-name').innerHTML = itemName;
          document.getElementById('common-tooltip-popper').style.top = (top + 60) + 'px';
          document.getElementById('common-tooltip-popper').style.display = 'block';
        }
      },
      mouseout(event) {
        document.getElementById('common-tooltip-popper').style.display = 'none';
      }
    }
  };
</script>
