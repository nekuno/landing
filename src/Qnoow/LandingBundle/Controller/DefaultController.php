<?php

namespace Qnoow\LandingBundle\Controller;

use Qnoow\LandingBundle\Entity\Prospect;
use Qnoow\LandingBundle\Form\Type\ContactProspectFormType;
use Qnoow\LandingBundle\Form\Type\EnterpriseProspectFormType;
use Qnoow\LandingBundle\Form\Type\ProspectFormType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Common\Persistence\ObjectManager;

class DefaultController extends Controller
{
    public function indexAction(Request $request)
    {
        $prospect = new Prospect();
        $form = $this->createForm(ProspectFormType::class, $prospect);
        return $this->render('QnoowLandingBundle::index.html.twig',
            array(
                'form' => $form->createView(),
                'invitationError' => $request->get('invitationError'),
                'showLoginForm' => $request->get('showLoginForm'),
            ));
    }

    public function aboutUsAction()
    {
        return $this->render('QnoowLandingBundle::about-us.html.twig', array('selected' => 'about_us'));
    }

    public function pressAction()
    {
        return $this->render('QnoowLandingBundle::press.html.twig', array('selected' => 'press'));
    }

    public function jobsAction()
    {
        return $this->render('QnoowLandingBundle::jobs.html.twig', array('selected' => 'jobs'));
    }

    public function frequentlyAskedQuestionsAction()
    {
        return $this->render('QnoowLandingBundle::frequently-asked-questions.html.twig');
    }

    public function enterpriseContactAction(Request $request)
    {
        $form = $this->createForm(EnterpriseProspectFormType::class);
        $form->handleRequest($request);

        if ($form->isValid()) {
            /* @var $em ObjectManager */
            $em = $this->getDoctrine()->getManager();
            $em->persist($form->getData());
            $em->flush();

            $adminBaseUrl = $this->getParameter('admin.base_url');
            $recipients = $this->getParameter('enterprise_prospect.recipients');

            $message = \Swift_Message::newInstance()
                ->setSubject('Nueva solicitud de Nekuno para empresas')
                ->setFrom('enredos@nekuno.com', 'Nekuno')
                ->setTo($recipients)
                ->setContentType('text/html')
                ->setBody($this->render(
                    'QnoowLandingBundle:Notification:invitation-requested.html.twig',
                    array('enterpriseProspect' => $form->getData(), 'adminBaseUrl' => $adminBaseUrl)));

            $translator = $this->get('translator');
            $recipients = $this->get('mailer')->send($message);
            if ($recipients) {
                $this->get('session')->getFlashBag()->add('success', $translator->trans('landing.enterprise_contact.success'));
            } else {
                $this->get('session')->getFlashBag()->add('error', $translator->trans('landing.enterprise_contact.error'));
            }
        }

        return $this->render('QnoowLandingBundle::enterprise-contact.html.twig', array('selected' => 'enterprise', 'form' => $form->createView()));
    }

    public function contactAction(Request $request)
    {
        $form = $this->createForm(ContactProspectFormType::class);
        $form->handleRequest($request);

        if ($form->isValid()) {
            /* @var $em ObjectManager */
            $em = $this->getDoctrine()->getManager();
            $em->persist($form->getData());
            $em->flush();

            $recipients = $this->getParameter('contact_prospect.recipients');

            $message = \Swift_Message::newInstance()
                ->setSubject('Nuevo contacto de Nekuno')
                ->setFrom('enredos@nekuno.com', 'Nekuno')
                ->setTo($recipients)
                ->setContentType('text/html')
                ->setBody($this->render(
                    'QnoowLandingBundle:Notification:contact-notification.html.twig',
                    array('contactProspect' => $form->getData())));


            $translator = $this->get('translator');
            $recipients = $this->get('mailer')->send($message);
            if ($recipients) {
                $this->get('session')->getFlashBag()->add('success', $translator->trans('landing.contact.success'));
            } else {
                $this->get('session')->getFlashBag()->add('error', $translator->trans('landing.contact.error'));
            }
        }

        return $this->render('QnoowLandingBundle::contact.html.twig', array('selected' => 'contact', 'form' => $form->createView()));
    }

    public function privacyPolicyAction()
    {
        return $this->render('QnoowLandingBundle::privacy-policy.html.twig', array('selected' => 'privacy_policy'));
    }

    public function legalNoticeAction(Request $request)
    {
        $locale = $request->getLocale();
        $markDown = file_get_contents(__DIR__ . '/../Resources/translations/legal-notice_' . $locale . '.md');
        $parseDown = new \Parsedown();

        return $this->render('QnoowLandingBundle::legal-notice.html.twig', array('html' => $parseDown->text($markDown), 'selected' => 'use_terms'));
    }

    public function requestInvitationAction(Request $request)
    {
        $prospect = new Prospect();
        $form = $this->createForm(ProspectFormType::class, $prospect);
        $form->handleRequest($request);
        $translator = $this->get('translator');

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($prospect);
            $em->flush();

            return new JsonResponse(array('message' => $translator->trans('invitation.invitation_required.flash.email_saved_correctly')), 200);
        }

        return new JsonResponse(array('message' => $translator->trans('invitation.invitation_required.flash.error')), 422);
    }
}
