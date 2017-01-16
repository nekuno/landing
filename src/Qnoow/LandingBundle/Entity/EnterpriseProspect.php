<?php

namespace Qnoow\LandingBundle\Entity;

class EnterpriseProspect extends Prospect
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $telephoneNumber;

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    public function getTelephoneNumber()
    {
        return $this->telephoneNumber;
    }

    public function setTelephoneNumber($telephoneNumber)
    {
        $this->telephoneNumber = $telephoneNumber;

        return $this;
    }
}