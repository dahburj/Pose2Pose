import React, { Component } from 'react'
import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { setLayout } from './redux/actions'

import Nav from './components/Nav'
import Profile from './components/Profile'
import Workspace from './components/Workspace'
import Settings from './components/Settings'
import Help from './components/Help'

const mapStateToProps = state => ({
  layout: state.layout,
  breakScreen: state.settings.breakScreen,
  videoSrc: state.video.url
})

const mapDispatchToProps = dispatch => ({
  setLayout: layout => dispatch(setLayout(layout))
})

class App extends Component {

  componentWillMount = () => {
    this.setLayout()
    if (this.props.layout)
      this.props.history.push('/profile')
  }
  componentDidMount = () => window.addEventListener('resize', this.setLayout)
  componentWillUnmount = () => window.removeEventListener('resize', this.setLayout)
  componentWillReceiveProps = nextProps => {
    if (this.props.videoSrc !== nextProps.videoSrc)
      if (!this.props.layout)
        this.props.history.push('/')
  }

  setLayout = () => {
    const { layout, breakScreen, setLayout } = this.props
    const newLayout = (window.innerWidth > breakScreen)
    if (layout !== newLayout)
      setLayout(newLayout)
  }

  setPath = path => {
    const { layout } = this.props
    if (layout)
      this.props.history.push(path)
    else {
      const currentPath = '/' + this.props.location.pathname.split('/')[1]
      this.props.history.push((path === currentPath) ? '/' : path)
    }
  }

  render() {
    const { layout } = this.props
    const { setPath } = this
    return (
      <div className={'app' + (layout ? '' : '-mobile')}>
        <Route path='/' render={() => <Nav setPath={setPath} />} />
        <Route path='/profile' render={() => <Profile />} />
        <Route path='/settings' render={() => <Settings />} />
        <Route path='/help' render={() => <Help />} />
        {layout && <Route path='/' render={() => <Workspace />} />}
        {!layout && <Route exact path='/' render={() => <Workspace />} />}
      </div>
    )
  }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))