<?php

namespace Qnoow\LandingBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;

class ExceptionListener
{
    protected $templating;
    protected $kernel;
    protected $translator;

    public function __construct(EngineInterface $templating, $kernel, $translator)
    {
        $this->templating = $templating;
        $this->kernel = $kernel;
        $this->translator = $translator;
    }

    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        if ('prod' == $this->kernel->getEnvironment()) {
            $request = $event->getRequest();
            $locale = $request->getSession()->get('_locale');
            $locale = $locale ?: $request->getLocale();
            $this->translator->setLocale($locale);

            $exception = $event->getException();

            $response = new Response();

            $response->setContent(
                $this->templating->render(
                    'QnoowLandingBundle:Exception:exception.html.twig',
                    array('exception' => $exception)
                )
            );

            if ($exception instanceof HttpExceptionInterface) {
                $response->setStatusCode($exception->getStatusCode());
                $response->headers->replace($exception->getHeaders());
            } else {
                $response->setStatusCode(500);
            }

            $event->setResponse($response);
        }
    }
}