import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { UsersService } from 'src/users/users.service';

import {
  randomDidKey,
  buildIssuer,
  buildAndSignFulfillment,
  buildKycAmlManifest,
  decodeCredentialApplication,
  buildCredentialApplication,
  buildKycVerificationOffer,
  buildPresentationSubmission,
  validateVerificationSubmission,
  decodeVerifiableCredential,
  decodeVerifiablePresentation,
  KYCAMLAttestation,
} from 'verite';

import { randomBytes } from 'crypto';

@Injectable()
export class VeriteService {
  Verite_URL = 'https://api-sandbox.verite.com/v1';

  constructor(
    private readonly userService: UsersService,
  ) {}

  async issueKYC(userId: string) : Promise<any> {
    const user = await this.userService.findById(userId);
    //  Simulation of key generation and storage
    //  Each party will have their own keys and will need to maintain these
    const subject = randomDidKey(randomBytes);
    const issuerDidKey = randomDidKey(randomBytes);
    try {
      //  Issuer builds a manifest representing the type of credential (in this case a KYCAML credential)
      const manifest = buildKycAmlManifest({ id: issuerDidKey.controller });
      //  The credential application is created and returned as a JWT
      const application = await buildCredentialApplication(subject, manifest);
      //  The decoded JWT is necessary when it comes time to issue the verifiable presentation which will include this credential
      const decodedApplication = await decodeCredentialApplication(application);
      console.log(decodedApplication);
      //  The attestation is a standardized representation of the issuer
      //  The issuer is created from the issuer key, and the credential is issued
      const issuer = buildIssuer(issuerDidKey.subject, issuerDidKey.privateKey);
      console.log(issuer);
      const manifestId = decodedApplication.credential_application.manifest_id;
      let attestation: KYCAMLAttestation;
      // eslint-disable-next-line prefer-const
      attestation = {
        type: 'KYCAMLAttestation',
        process: 'https://demos.verite.id/schemas/definitions/1.0.0/kycaml/usa',
        approvalDate: new Date().toISOString(),
      };
      const presentation = await buildAndSignFulfillment(
        issuer,
        decodedApplication,
        attestation,
      );

      //  As with the application, the verifiable presentation (which contains the credential)
      //  is in JWT form and must be decoded by the subject. This can be done in a mobile app
      //  client or a wbe browser.
      const decoded = await decodeVerifiablePresentation(presentation);
      //  The verifiable credential is another JWT within the verifiable presentation and
      //  can be extracted like this:
      const vc = decoded.verifiableCredential[0];
      console.log('VC');
      console.log(vc);
      //Save JWT token for verification
      user.verite_token=vc.proof.jwt;
      user.subject_id=subject.id;
      user.issuer_id=issuerDidKey.id;
      user.kyc=true;
      user.save();
      //  The verifiable credential must then be decoded so that the subject can request
      //  verification
      const decodedVc = await decodeVerifiableCredential(vc.proof.jwt);
      console.log(decodedVc);
      console.log('Credential verified!');
    } catch (e) {
      console.log(e);
    }
  }


  async verifyKYC(userId: string) : Promise<any> {
    const user = await this.userService.findById(userId);
    const verifier = randomDidKey(randomBytes);
    const decodedVc = await decodeVerifiableCredential(user.verite_token)
    const subject = randomDidKey(randomBytes);;
        
        //  The subject would make a request to the verifier's server to obtain the verification
        //  offer. The code below must be executed by the verifier, using the verifier's key.
        const offer = buildKycVerificationOffer(
            uuidv4(),
            verifier.subject,
            "https://test.host/verify"
        )
        
        //  The subject can then create a submission is the full verification request which would
        //  be sent to the verifier that uses the offer created and supplied by the verifier
        const submission = await buildPresentationSubmission(
           subject,
            offer.body.presentation_definition,
            decodedVc
        )
        
        //  The verifier will take the submission and verify its authenticity. There is no response
        //  from this function, but if it throws, then the credential is invalid.
        await validateVerificationSubmission(
            submission,
            offer.body.presentation_definition
        )
        console.log("Credential verified!")
  }
}
