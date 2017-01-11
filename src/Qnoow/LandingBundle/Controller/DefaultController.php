<?php

namespace Qnoow\LandingBundle\Controller;

use Qnoow\UserBundle\Form\Type\ContactProspectFormType;
use Qnoow\UserBundle\Form\Type\EnterpriseProspectFormType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Common\Persistence\ObjectManager;

class DefaultController extends Controller
{
    // This is called from src/Qnoow/UserBundle/Controller/SecurityController.php
    public function indexAction()
    {
        return $this->render('QnoowLandingBundle::index.html.twig');
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
        $form = $this->createForm(new EnterpriseProspectFormType());
        $form->handleRequest($request);

        if ($form->isValid()) {
            /* @var $em ObjectManager */
            $em = $this->getDoctrine()->getManager();
            $em->persist($form->getData());
            $em->flush();

            $adminBaseUrl = $this->container->getParameter('admin.base_url');
            $recipients = $this->container->getParameter('enterprise_prospect.recipients');

            $message = \Swift_Message::newInstance()
                ->setSubject('Nueva solicitud de Nekuno para empresas')
                ->setFrom('enredos@nekuno.com', 'Nekuno')
                ->setTo($recipients)
                ->setContentType('text/html')
                ->setBody($this->render(
                    'QnoowWebBundle:Static/Notification:invitation_requested.html.twig',
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
        $form = $this->createForm(new ContactProspectFormType());
        $form->handleRequest($request);

        if ($form->isValid()) {
            /* @var $em ObjectManager */
            $em = $this->getDoctrine()->getManager();
            $em->persist($form->getData());
            $em->flush();

            $recipients = $this->container->getParameter('contact_prospect.recipients');

            $message = \Swift_Message::newInstance()
                ->setSubject('Nuevo contacto de Nekuno')
                ->setFrom('enredos@nekuno.com', 'Nekuno')
                ->setTo($recipients)
                ->setContentType('text/html')
                ->setBody($this->render(
                    'QnoowWebBundle:Static/Notification:contact-notification.html.twig',
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

    public function legalNoticeAction()
    {
        return $this->render('QnoowLandingBundle::legal-notice.html.twig', array('selected' => 'use_terms'));
    }
}
