import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message, Container, Grid, Button, Icon, Form, Divider } from 'semantic-ui-react'
import { generateMnemonic } from '../../services/keyring-vault-proxy'
import { setNewPhrase } from '../../background/store/account'
import { CONFIRM_PHRASE_ROUTE } from '../../constants/routes'
import { Button as StyledButton, Section, MnemonicPad } from '../basic-components'

interface IGeneratePhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IGeneratePhraseState {
  accountName: string,
  mnemonic: string,
  message?: string,
  color: 'blue' | 'red'
}

class GeneratePhrase extends React.Component<IGeneratePhraseProps, IGeneratePhraseState> {

  state: IGeneratePhraseState = {
    accountName: '',
    mnemonic: '',
    color: 'blue'
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // generate the mnemonic
    generateMnemonic().then(phrase => {
      this.setState({ mnemonic: phrase })
    })
  }

  handleChange = event => {
    this.setState({ accountName: event.target.value })
  }

  handleClick = () => {
    this.setState({ message: '' })
    this.props.setNewPhrase(this.state.mnemonic, this.state.accountName)
    this.props.history.push(CONFIRM_PHRASE_ROUTE)
  }

  selectAll = (event) => {
    event.target.select()
  }

  copyText = () => {
    const el = document.createElement('textarea')
    el.value = this.state.mnemonic
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)

    this.setState({ message: t('copyTextMessage') })
    setTimeout(() => {
      this.setState({ message: '' })
    }, 3000)
  }

  downloadFile = () => {
    let element = document.createElement('a')
    element.setAttribute('href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.mnemonic))
    element.setAttribute('download', 'secret-phrase.txt')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  render () {
    return (
        <div>
          <Progress color={this.props.settings.color} progress={2} />
          <Section>
            {t('phraseDescription')}
          </Section>

          <Section>
            <Form>
              <Form.Input
                label={t('accountNameTitle')}
                type='input'
                value={this.state.accountName}
                onChange={this.handleChange}
                placeholder={t('accountName')}
              />
              <Form.TextArea
                label={t('phraseTitle')}
                value={this.state.mnemonic}
                readOnly={true}
                onClick={this.selectAll}
              />

              <Container>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Button onClick={this.copyText}>
                        <Icon name='copy' />
                        {t('copyText')}
                      </Button>
                    </Grid.Column>
                    <Grid.Column>
                      <Button onClick={this.downloadFile}>
                        <Icon name='download' />
                        {t('downloadFile')}</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>

              <Divider />

              <StyledButton onClick={this.handleClick}>
                {t('createAccount')}
              </StyledButton>

            </Form>
          </Section>
        </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    accountStatus: state.account
  }
}

const mapDispatchToProps = { setNewPhrase }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GeneratePhrase))
