<?php

namespace Qnoow\LandingBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LocaleListener implements EventSubscriberInterface
{
    private $defaultLocale;

    public function __construct($defaultLocale)
    {
        $this->defaultLocale = $defaultLocale;
    }

    public static function getSubscribedEvents()
    {
        return array(
            // must be registered before the default Locale listener
            KernelEvents::REQUEST => array(array('onKernelRequest', 17)),
        );
    }

    public function onKernelRequest(GetResponseEvent $event)
    {

        $request = $event->getRequest();
        $request->setDefaultLocale($this->defaultLocale);

        $locale = $request->attributes->get('_locale');

        if (!$locale && $request->query->has('_locale')) {
            $locale = $request->query->get('_locale');
        }

        if (!$locale && !$request->hasPreviousSession() && $request->getPreferredLanguage()) {

            $locale = $request->getPreferredLanguage();

        } elseif (!$locale && $request->getSession()->has('_locale')) {

            $locale = $request->getSession()->get('_locale');
        }

        if (!$locale) {
            $locale = $this->defaultLocale;
        }

        if ($this->isSpanishLocale($locale)) {
            $locale = 'es';
        } else {
            $locale = 'en';
        }

        $request->setLocale($locale);
        $request->getSession()->set('_locale', $locale);

    }

    private function isSpanishLocale($locale)
    {
        foreach (['es', 'an', 'ca', 'eu', 'gl'] as $prefix) {
            if (substr($locale, 0, 2) === $prefix) {
                return true;
            }
        }

        return false;
    }
}