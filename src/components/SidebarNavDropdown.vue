<template>
  <li class="nav-item nav-dropdown" @mouseover="mouseover(name,$event)" @mouseout="mouseout(name,$event)" disabled>
    <div class="nav-link nav-dropdown-toggle" @click="handleClick"><i :class="icon"></i> <span class="nav-name">{{name}}</span></div>
    <ul class="nav-dropdown-items">
      <slot></slot>
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.currentTarget.parentElement.classList.toggle('open');
    },
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
  },
};
</script>
