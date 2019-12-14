import React from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

export class Login extends React.Component {
    render() {
        return (
            <div>
                <Form>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="exampleUsername">Username</Label>
                                <Input type="text" name="username" id="exampleUsername" placeholder="with a placeholder" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button>Sign in</Button>
                </Form>
            </div>
        );
    }
}